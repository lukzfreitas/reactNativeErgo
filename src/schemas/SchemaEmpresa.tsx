export class SchemaEmpresa {
    static schema = {
        name: 'EmpresaSchema',
        primaryKey: 'cnpj',
        properties: {       
            id: { type: 'int?' },     
            idRegional: { type: 'int?' },
            cnpj: { type: 'string' },
            razaoSocial: { type: 'string' }
        }
    }
}
