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
        await AsyncStorage.mergeItem(nameStorage, JSON.stringify(newObject));        
    }

    static remove: any = async (nameStorage: string) => {
        await AsyncStorage.removeItem(nameStorage);
    }
}
