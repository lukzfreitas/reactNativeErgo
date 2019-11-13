import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';

export class AsyncStorageService extends Component {
    
    static saveItem = async (nameStorage: string, object: any) => {        
        await AsyncStorage.setItem(nameStorage, JSON.stringify(object))        
    }

    static getItem: any = async (nameStorage: string) => {
        let result: any = null;
        result = await AsyncStorage.getItem(nameStorage);                
        return JSON.parse(result);
    }

    static updateItem: any = async (nameStorage: string,  newObject: any) => {        
        await AsyncStorage.getItem(nameStorage).then( async (data: any) => {
            data = JSON.parse(data);
            data = newObject;            
            await AsyncStorage.setItem(nameStorage, JSON.stringify(data));            
        })   
        let result: any = await AsyncStorage.getItem(nameStorage);     
        return JSON.parse(result);
    }

    static remove: any = async (nameStorage: string) => {
        await AsyncStorage.removeItem(nameStorage);
    }
}
