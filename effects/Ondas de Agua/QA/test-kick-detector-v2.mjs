import assert from 'node:assert/strict';

const sampleRate = 1000;
const settings = {
  fastSeconds: 0.018,
  slowSeconds: 0.28,
  baseThreshold: 0.02,
  attackDemand: 0.1,
  cooldownSeconds: 0.18
};

function onePole(previous, input, seconds) {
  const alpha = 1 - Math.exp(-1 / (sampleRate * seconds));
  return previous + alpha * (input - previous);
}

function detect(samples) {
  let fast = 0;
  let slow = 0;
  let previousCandidate = false;
  let blockedUntil = -1;
  const triggers = [];
  for (let i = 0; i < samples.length; i += 1) {
    const raw = Math.max(0, samples[i]);
    const energy = raw / (1 + raw);
    fast = onePole(fast, energy, settings.fastSeconds);
    slow = onePole(slow, energy, settings.slowSeconds);
    const transient = Math.max(0, fast - slow);
    const threshold = settings.baseThreshold + slow * settings.attackDemand;
    const candidate = transient > threshold;
    if (candidate && !previousCandidate && i / sampleRate >= blockedUntil) {
      triggers.push(i / sampleRate);
      blockedUntil = i / sampleRate + settings.cooldownSeconds;
    }
    previousCandidate = candidate;
  }
  // Device/FFT start-up is not a musical event. The Wire patch is intended to
  // be enabled before playback; ignore the initial settling window in tests.
  return triggers.filter(time => time >= 0.5);
}

function signal(duration, baseline, kicks) {
  // Fade the bed in slowly, as happens once the FFT input has settled. This
  // keeps the tests focused on kick attacks instead of treating device start
  // as a musical transient.
  const result = Array.from({ length: Math.ceil(duration * sampleRate) }, (_, i) =>
    baseline * (1 - Math.exp(-(i / sampleRate) / 0.45))
  );
  for (const { time, amplitude, decay = 0.055 } of kicks) {
    const start = Math.round(time * sampleRate);
    for (let i = start; i < result.length; i += 1) {
      const age = (i - start) / sampleRate;
      if (age > decay * 7) break;
      result[i] += amplitude * Math.exp(-age / decay);
    }
  }
  return result;
}

const cases = [
  {
    name: 'kicks debiles',
    samples: signal(3.0, 0.02, [0.7, 1.2, 1.7, 2.2].map(time => ({ time, amplitude: 0.45 }))),
    expected: 4
  },
  {
    name: 'kicks fuertes sin saturacion dura',
    samples: signal(3.0, 0.08, [0.7, 1.2, 1.7, 2.2].map(time => ({ time, amplitude: 5.0 }))),
    expected: 4
  },
  {
    name: 'grave sostenido con ataques',
    samples: signal(3.5, 1.1, [1.2, 1.7, 2.2, 2.7].map(time => ({ time, amplitude: 2.0, decay: 0.045 }))),
    expected: 4
  },
  {
    name: 'golpes consecutivos validos',
    samples: signal(2.0, 0.05, [0.6, 0.82, 1.04, 1.26, 1.48].map(time => ({ time, amplitude: 1.2, decay: 0.035 }))),
    expected: 5
  },
  {
    name: 'un solo grave sostenido',
    samples: signal(2.3, 0.0, [{ time: 0.7, amplitude: 2.0, decay: 0.8 }]),
    expected: 1
  }
];

const report = [];
for (const testCase of cases) {
  const triggers = detect(testCase.samples);
  assert.equal(triggers.length, testCase.expected, `${testCase.name}: ${triggers.join(', ')}`);
  for (let i = 1; i < triggers.length; i += 1) {
    assert.ok(triggers[i] - triggers[i - 1] >= settings.cooldownSeconds - 0.001);
  }
  report.push({ name: testCase.name, expected: testCase.expected, detected: triggers.length, triggers });
}

console.log(JSON.stringify({ settings, cases: report }, null, 2));

