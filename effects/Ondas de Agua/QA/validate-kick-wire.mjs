import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const project = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(import.meta.dirname, '..');
const wireName = fs.readdirSync(project).find(name => name.toLowerCase().endsWith('.wire'));
assert.ok(wireName, `No se encontro un archivo .wire en ${project}`);
const wirePath = path.join(project, wireName);
const shaderPath = path.join(project, 'Resource', 'ISF', 'OndasBajosDireccion.isf');
const wire = JSON.parse(fs.readFileSync(wirePath, 'utf8'));
const shaderText = fs.readFileSync(shaderPath, 'utf8');
const headerMatch = shaderText.match(/^\/\*([\s\S]*?)\*\//);
assert.ok(headerMatch, 'El shader no tiene cabecera ISF valida');
const shaderHeader = JSON.parse(headerMatch[1]);
const nodeIds = new Set(Object.keys(wire.patch.nodes).map(Number));

for (const connection of wire.patch.connections) {
  assert.ok(nodeIds.has(Number(connection.from[0])), `Origen inexistente: ${connection.from[0]}`);
  assert.ok(nodeIds.has(Number(connection.to[0])), `Destino inexistente: ${connection.to[0]}`);
  assert.equal(typeof connection.from[1], 'string');
  assert.equal(typeof connection.to[1], 'string');
}

for (const rootInput of wire.patch.inputOrder.roots) {
  assert.ok(nodeIds.has(Number(rootInput.node)), `Control publicado inexistente: ${rootInput.node}`);
}

const shaderNode = wire.patch.nodes['2'];
const resource = shaderNode.attributes['fragment-shader'].value.value;
const declaredInputs = new Set(shaderHeader.INPUTS.map(input => input.NAME));
const resourceInputs = new Set(resource.inputs.map(input => input.name));
for (const name of declaredInputs) {
  assert.ok(resourceInputs.has(name), `Entrada ISF ausente en el recurso Wire: ${name}`);
  assert.ok(Object.hasOwn(shaderNode.constants, name), `Constante ISF ausente en Wire: ${name}`);
}

const requiredNames = [
  'Energia normalizada', 'Envolvente rapida 18 ms', 'Referencia adaptativa 280 ms',
  'Transitorio positivo', 'Umbral adaptativo', 'Bloqueo activo', 'Intervalo minimo (ms)',
  'Contador de disparos', 'Mostrar diagnostico'
];
const names = new Set(Object.values(wire.patch.nodes).map(node => node.name));
for (const name of requiredNames) assert.ok(names.has(name), `Nodo requerido ausente: ${name}`);

assert.equal(wire.patch.meta.displayName, 'Ondas de Agua');
assert.ok(fs.existsSync(shaderPath));
assert.equal((shaderText.match(/void\s+main\s*\(/g) || []).length, 1, 'Shader ISF con main duplicado o ausente');

console.log(JSON.stringify({
  wire: wirePath,
  nodes: nodeIds.size,
  connections: wire.patch.connections.length,
  controls: wire.patch.inputOrder.roots.length,
  shaderInputs: declaredInputs.size,
  resourcePath: shaderNode.attributes['fragment-shader'].value.path.main
}, null, 2));
