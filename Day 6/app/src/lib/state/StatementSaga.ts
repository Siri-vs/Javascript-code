import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addSuccess,
  updateSuccess,
  deleteSuccess,
} from "./StatementSlice";
import { getAllTxns, addTxn, saveTxn, delTxnById } from "../service/txnsApi";

function* fetchTxnsSaga() {
  try {
    yield put(fetchStart());
    const response = yield call(getAllTxns);
    yield put(fetchSuccess(response.data));
  } catch {
    yield put(fetchFailure("Unable to fetch transactions"));
  }
}

function* addTxnSaga(action: any) {
  const response = yield call(addTxn, action.payload);
  yield put(addSuccess(response.data));
}

function* updateTxnSaga(action: any) {
  const response = yield call(saveTxn, action.payload.id, action.payload);
  yield put(updateSuccess(response.data));
}

function* deleteTxnSaga(action: any) {
  yield call(delTxnById, action.payload);
  yield put(deleteSuccess(action.payload));
}

export default function* statementSaga() {
  yield takeLatest("statement/fetch", fetchTxnsSaga);
  yield takeLatest("statement/add", addTxnSaga);
  yield takeLatest("statement/update", updateTxnSaga);
  yield takeLatest("statement/delete", deleteTxnSaga);
}
