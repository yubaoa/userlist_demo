import request, { extend } from 'umi-request';
import { message } from 'antd'
import {FormValues} from './data.d'
const errorHandler = function(error:any) {
  const codeMap = {
    '021': 'An error has occurred',
    '022': 'It’s a big mistake,',
    // ....
  };
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if(error.response.status >400) {
      message.error(error.data.message?error.data.message:error.data)
    }
    //console.log(error.response.status);
    //console.log(error.data.message);
    //console.log(error.data);
    // console.log(error.response.headers);
    // console.log(error.request);
    // console.log(codeMap[error.data.status]);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    message.error('网络错误')
  }
  throw error

  //throw error; // If throw. The error will continue to be thrown.

  // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
  // return {some: 'data'};
};
const extendRequest = extend({ errorHandler });
export const getList = async ({page,per_page}:{page:number;per_page:number}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users?page=${page}&per_page=${per_page}`, { method: "get" })
    .then(response => response)
    .catch(reason => false
    )
  {/* const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ]
  return data */}
}
export const editUser = async ({ id, values }:{id:number;values:FormValues}) => {
  console.log(id);

  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`,
    {
      method: "put",
      data: values
    }
  ).then(response => {
    return true
  }).catch(reason => {
    return false
  }
  )
}
export const deleteUser = async ({ id }:{id:number}) => {
  console.log(id);
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: "delete"
  }
  ).then(response => {
    return true
  }).catch(reason => {
    return false
    //console.log(reason)
  }
  )
}
export const addUser = async ({values}:{values:FormValues}) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users`, {
    method: "post",
    data:values
  }
  ).then(response => {
    //message.success('添加成功');
    return true
  }).catch(reason => {
    //message.error('添加失败');
    return false
    //console.log(reason)
  }
  )
}


