export class SchemaSetor {
    static schema = {
        name: 'SetorSchema',
        properties: {
            id: 'int?',         
            nome: { type: 'string' },
            empresa: 'EmpresaSchema?'
        }
    }
}
