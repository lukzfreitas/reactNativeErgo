import React, { Component } from 'react';
import { ApiFiergsConnect, InstanceAxios } from '../providers';

export class QuestionService extends Component {
    static postQuestions = async (quest: any) => {
        return InstanceAxios.post('/questionario', quest).then((response: any) => {
            if (response.status === 200) {
                return response
            } else {
                console.log(response);
            }
        }).catch((error: any) => {
            console.error(error);
        });
    }
}
