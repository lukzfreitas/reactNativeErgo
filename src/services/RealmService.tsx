import React, { Component } from 'react'
import Realm from 'realm';
import { SchemaEmpresa, SchemaQuestionario, SchemaSetor } from '../schemas'

export class RealmService extends Component {
    static getRealm = () => {
        return Realm.open({
            schema: [SchemaEmpresa, SchemaQuestionario, SchemaSetor]
        });
    }
}



