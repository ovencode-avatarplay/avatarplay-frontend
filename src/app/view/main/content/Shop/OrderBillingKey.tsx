'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';

interface OrderParams {
  service_oid: string;
  comments: string;
  billing_key: string;
  securityCode: string;
  totalAmount: string;
  currency: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  resultUrl?: string;
}

function OrderBillingKey() {
  const location = useLocation();
  const orderParams = (location.state as {orderParams: OrderParams})?.orderParams;

  const [apiId, setApiId] = useState<string>('');

  const billKeyReq = async () => {
    if (!window.confirm('빌링키 결제요청을 전송합니다. 진행하시겠습니까?')) return;

    $('#payBillingKey').off('click');

    try {
      const {data} = await axios.post('/api/payBillkey', {
        service_oid: orderParams.service_oid,
        comments: orderParams.comments,
        billing_key: orderParams.billing_key,
        securityCode: orderParams.securityCode,
        totalAmount: orderParams.totalAmount,
        currency: orderParams.currency,
        firstName: orderParams.firstName,
        lastName: orderParams.lastName,
        email: orderParams.email,
        resultUrl: orderParams.resultUrl,
      });

      $('#billingOrderBody').hide();
      $('#payResTable').hide();
      $('#responseBody').show();
      $('#billingTable').show();

      if (data.result === 'A0000') {
        alert(data.message);
        setApiId(data.api_id);
        $('#payConfirmCancel').show();
      } else {
        alert(data.message || '빌링키 결제 요청 실패');
      }

      let table_data = '';
      for (const key in data) {
        table_data += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
      }
      $('#billingResult').append(table_data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelReq = async () => {
    if (!window.confirm('승인취소요청을 전송합니다. 진행하시겠습니까?')) return;

    $('#payConfirmCancel').off('click');

    try {
      const {data} = await axios.post('/api/cancel', {
        comments: orderParams.comments,
        service_oid: orderParams.service_oid,
        pay_id: apiId,
        totalAmount: orderParams.totalAmount,
        currency: orderParams.currency,
        resultUrl: '',
      });

      if (data.result === 'A0000') {
        alert(data.message);
        $('#payConfirmCancel').hide();
      } else {
        alert(data.message || '승인취소 요청 실패');
      }

      let table_data = '';
      for (const key in data) {
        table_data += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
      }

      $('#payRefundResult').append(table_data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!orderParams) return <div>잘못된 접근입니다.</div>;

  return (
    <>
      <div className="device__layout w-600" id="billingOrderBody" style={{display: 'block'}}>
        <div className="line_setter">
          <h4 className="tit__device mb-32">
            <img className="logo_in_text__md" src="/images/logo_full.svg" alt="" />
            <b>해외결제 API - 빌링키 결제</b>
          </h4>
          <div className="table-outter">
            <table className="model-01">
              <colgroup>
                <col style={{width: '50%'}} />
                <col style={{width: '50%'}} />
              </colgroup>
              <thead>
                <tr>
                  <th>파라미터 항목</th>
                  <th>파라미터 값</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>주문번호</td>
                  <td>{orderParams.service_oid}</td>
                </tr>
                <tr>
                  <td>빌링키</td>
                  <td>{orderParams.billing_key}</td>
                </tr>
                <tr>
                  <td>상품명</td>
                  <td>{orderParams.comments}</td>
                </tr>
                <tr>
                  <td>결제금액</td>
                  <td>
                    {orderParams.currency} {orderParams.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="btn_box has_space align_center">
            <button className="btn cl_main btn_rounded btn_md" type="button" id="payBillingKey" onClick={billKeyReq}>
              빌링키 결제하기
            </button>
          </div>
        </div>
      </div>

      <div className="device__layout w-600" id="responseBody" style={{display: 'none'}}>
        <div className="line_setter">
          <h4 className="tit__device mb-32">
            <img className="logo_in_text__md" src="/images/logo_full.svg" alt="" />
            해외결제 결과
          </h4>
          <br />
          <br />
          <div id="billingTable" style={{display: 'none'}}>
            <b>Billing Key Response (빌링키 결제 결과)</b>
            <br />
            <br />
            <div className="table-outter">
              <table className="model-01" id="billingResult">
                <colgroup>
                  <col style={{width: '50%'}} />
                  <col style={{width: '50%'}} />
                </colgroup>
                <thead>
                  <tr>
                    <th>파라미터 항목</th>
                    <th>파라미터 값</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="btn_box has_space align_center">
              <button
                className="btn cl_main btn_rounded btn_md"
                type="button"
                id="payConfirmCancel"
                onClick={cancelReq}
                style={{display: 'none'}}
              >
                결제승인취소
              </button>
            </div>
          </div>
          <b>Response (취소 결과)</b>
          <br />
          <br />
          <div className="table-outter">
            <table className="model-01" id="payRefundResult">
              <colgroup>
                <col style={{width: '50%'}} />
                <col style={{width: '50%'}} />
              </colgroup>
              <thead>
                <tr>
                  <th>파라미터 항목</th>
                  <th>파라미터 값</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderBillingKey;
