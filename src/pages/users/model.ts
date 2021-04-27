import { Effect, Reducer, Subscription } from 'umi';
import { getList, editUser, deleteUser, addUser } from './service'
import { message } from 'antd'
import { singleUserType } from './data.d'
export interface UserState {
  data: singleUserType[],
  meta: {
    total: number,
    per_page: number,
    page: number
  }
}
interface UserModelType {
  namespace: 'users';
  state: UserState;
  effects: {
    query: Effect;
    delete: Effect;
  };
  reducers: {
    save: Reducer<UserState>;
  };
  subscriptions: {
    setup: Subscription;
  };
}
const UserModel: UserModelType = {
  namespace: 'users',

  state: {
    data: [],
    meta: {
      total: 0,
      per_page: 10,
      page: 1
    }
  },

  effects: {
    *query({ payload: { page, per_page } }, { call, put }) {
      let data = yield call(getList, { page, per_page })
      // while(data !== undefined ) {
      //  data =  yield call(getlist)
      // }
      if (data) {
        yield put({
          type: 'save',
          payload: data
          //payload: data === undefined ? {} : data
        })
        //message.success(编辑成功)
      } else {
        //message.error(编辑失败)
      }

    },
    *delete({ payload: { id } }, { call, put, select }) {
      //console.log(id,values);
      const result = yield call(deleteUser, { id })
      const { page, per_page } = yield select((state:any)=> state.users.meta)
      if (result) {
        message.success("删除成功")
        yield put({
          type: 'query',
          payload: {
            page,
            per_page
          }
        })
      } else {
        message.error("删除失败")
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return payload
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'query',
            payload:{
              page:1,
              per_page: 10
            }
          });
        }
      });
    },
  },
};

export default UserModel;
