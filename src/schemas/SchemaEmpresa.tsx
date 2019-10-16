export class SchemaEmpresa {
    static schema = {
        name: 'EmpresaSchema',
        primaryKey: 'cnpj',
        properties: {            
            cnpj: { type: 'string' },
            nome: { type: 'string' },
            setores: { type: 'string[]' }
        }
    }
}
