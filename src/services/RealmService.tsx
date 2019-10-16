import React, { Component } from 'react'
import Realm from 'realm';
import { SchemaEmpresa } from '../schemas'

export class RealmService extends Component {
    static getRealm = () => {
        return Realm.open({
            schema: [SchemaEmpresa]
        });
    }
}



