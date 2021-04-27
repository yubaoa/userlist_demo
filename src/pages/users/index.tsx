import React, { useState, FC, useRef } from 'react';
import { Table, Popconfirm, Button, Pagination, message } from 'antd';
import ProTable, { ProColumns} from '@ant-design/pro-table';
import { getList, editUser, addUser } from './service'
import { connect, Dispatch, Loading, UserState } from 'umi';
import UserModal from './components/UserModal';
import { singleUserType, FormValues } from './data.d'
interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  loading: boolean;
}
const UserListPage: FC<UserPageProps> = ({ users, dispatch, loading }) => {
  //console.log(users);
  const [visiable, changeVisiable] = useState(false)
  const [edit, changeEdit] = useState<singleUserType | undefined>(undefined)
  const [confirmLoading, setconfirmLoading] = useState(false)
  const columns: ProColumns<singleUserType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      key: 'id',
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      valueType: 'text',
    },

    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
    },
    {

      title: 'Update Time',
      dataIndex: 'update_time',
      key: 'update_time',
      valueType: 'dateTime',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      valueType: 'option',
      render: (text, record: singleUserType) =>
      [
        <a onClick={editHandler(record)}> Edit</a>,
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={confirm(record)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">Delete</a>
        </Popconfirm>
     ]
    },
  ];
  const closeHandle = () => {
    changeVisiable(false)
  }
  const editHandler = (record: singleUserType) => {
    //console.log('record1', record);
    return () => {
      //console.log(record);
      changeEdit(record)
      changeVisiable(true)
    }
  }
  const onFinish = async (values: FormValues) => {
    console.log(values);

    setconfirmLoading(true)
    let id:any = 0;
    id = edit?.id
    let func = undefined;
    if (id) {
      func = editUser
    } else {
      func = addUser
    }
    const response = await func({ id, values })

    if (response) {
      message.success(`${id === undefined ? '添加' : '编辑'} 成功`)
      reLoadHandler()
      setconfirmLoading(false)
      changeVisiable(false)
    }
    else {
      message.error(`${id === undefined ? '添加' : '编辑'} 失败`)
      setconfirmLoading(false)
    }

    // console.log('Success:', values);
  };
  const confirm = (rec: singleUserType) => {
    //console.log(rec);

    return () => {
      dispatch({
        type: 'users/delete',
        payload: {
          id: rec.id,
        }
      })
    }
  }
  const add_User = () => {
    changeEdit(undefined)
    changeVisiable(true)
  }
  //使用protable
  //const visiable:boolean = true
  // const requestHandler = async ({ pageSize, current }: {
  //   pageSize: number;
  //   current: number;
  // },) => {
  //   console.log(pageSize);
  //   const users = await getList({
  //     page: current,
  //     per_page: pageSize
  //   })
  //   console.log(users)

  //   return {
  //     data: users.data,
  //     success: true,
  //     total: users.meta.total
  //   }
  // }
  const reLoadHandler = () => {
    dispatch({
      type: 'users/query',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page
      }
    })
  }
  const paginationHandler = (page:number, pageSize?:number) => {
    console.log(page, pageSize);
    dispatch({
      type: 'users/query',
      payload: {
        page,
        per_page: pageSize? pageSize :users.meta.per_page
      }
    })

  }
  return (
    <div className="list-table">

      <UserModal visiable={visiable} closeHandle={closeHandle} edit={edit} onFinish={onFinish} confirmLoading={confirmLoading} />
      <ProTable
        headerTitle="用户列表"
        columns={columns}
        dataSource={users.data}
        className="list-table"
        rowKey="id"
        loading={loading}
        // request={requestHandler}
        search={false}
        pagination={false}
        options={{
          density: true,
          fullScreen: false,
          reload: reLoadHandler,
          setting: true
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={add_User}>Add</Button>,
          <Button type="primary" onClick={reLoadHandler}>Reload</Button>
        ]}
      />
      <Pagination
        className="listpage"
        total={users.meta.total}
        onChange={paginationHandler}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
      />
    </div>
  )
}
export default connect(({ users, loading }: { users: UserState; loading: Loading; }) => ({ users, loading: loading.models.users })
)(UserListPage)
