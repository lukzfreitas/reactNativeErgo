import React from 'react'
import axios from 'axios';

export const InstanceAxios = axios.create({
    baseURL: 'localhost',
    timeout: 1000,
});