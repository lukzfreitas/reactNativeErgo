import React, { Component } from 'react'
import { InstanceAxios } from './InstanceAxios';
import { Base64Service } from '../services'

export class ApiFiergsConnect extends Component {
    static getTokenFiergsApi() {
        const AUTH = 'sono.saudavel:grievous0118';
        return InstanceAxios.get(
            '/user/auth',
            { headers: { Authorization: 'Basic '.concat(Base64Service.btoa(AUTH)) } }
        ).catch((error) => {            
            return error;
        });
    }
}
