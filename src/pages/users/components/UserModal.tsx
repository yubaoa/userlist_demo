import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch  } from 'antd';
import { singleUserType, FormValues} from '../data.d';
import moment from 'moment';

interface UserModelProps {
  visiable:boolean;
  edit:singleUserType | undefined;
  closeHandle:() => void ;
  onFinish:( value:FormValues) =>void
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const UserModal = (props: any) => {
  const { visiable, edit, closeHandle,  onFinish ,confirmLoading} = props
  //console.log(edit);

  const [form] = Form.useForm();
  useEffect(() => {
    if (edit !== undefined) {
      form.setFieldsValue({
        ...edit,
        create_time: moment(edit.create_time),
        status: edit.status ? true:false,
      });
    } else {
      form.resetFields()
    }
  }, [visiable])


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    closeHandle();
  };
  return (
    <Modal title={edit ? '编辑ID: '+edit.id : '添加' } forceRender visible={visiable} onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{ remember: true, status:true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}

      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Email"
          name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Status"
          name="status" valuePropName="checked">
          <Switch   />
        </Form.Item>

        <Form.Item label="Create_time"
          name="create_time">
          <DatePicker renderExtraFooter={() => 'extra footer'} showTime/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserModal
