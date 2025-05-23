'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import {getCurrentLanguage} from '@/utils/UrlMove';

interface OrderParams {
  isSimpleShort: string;
  billing_key: string;
  securityCode: string;
  isDirect: string;
  service_oid: string;
  comments: string;
  totalAmount: string;
  currency: string;
  lastName: string;
  firstName: string;
  email: string;
}

function OrderConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCallGpay, setIsCallGpay] = useState(false);
  const [orderParams, setOrderParams] = useState<OrderParams | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) {
      router.push('/order'); // 잘못된 접근이면 다시 이동
      return;
    }

    try {
      const parsed: OrderParams = JSON.parse(decodeURIComponent(q));
      setOrderParams(parsed);
    } catch (err) {
      console.error('파라미터 파싱 실패:', err);
      router.push('/order');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const handlePopState = () => {
      window.MainBodyAction?.('close');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePaymentReq = async () => {
    if (!orderParams) return;

    setIsCallGpay(true);

    try {
      const res = await axios.post('/api/auth');
      const {payCls, access_token} = res.data;

      const paymentPayload = {
        service_id: 'demo',
        service_oid: orderParams.service_oid,
        comments: orderParams.comments,
        totalAmount: orderParams.totalAmount,
        currency: orderParams.currency,
        firstName: orderParams.firstName,
        lastName: orderParams.lastName,
        email: orderParams.email,
        resultUrl: `http://localhost:3000/${getCurrentLanguage()}/store/orderresult`,
        isDirect: orderParams.isDirect,
        // payCls,
        // Authorization: access_token,
        payCls: 'demo',
        Authorization:
          'eyJhbGciOiJzaGEyNTYiLCJ0eXBlIjoiSldUIiwia2V5IjoiYm1WQ1IwSjViMnhLYml0RmQxaDFSM2hLY0dVMlZFMVZTR2gxWlRKV1pGRm1RVVF3VlRKSE56RlZTM2cxUXpsdVlVTXpUa2NyWTJsS2QwRkdiSEowWVEifS57Imdyb3VwX2lkIjoiZGVtb2dyb3VwIiwic2VydmljZV9pZCI6ImRlbW8iLCJzZXJ2aWNlX2tleSI6ImFiY2QxMjM0NTY3ODkwIiwiY29uRGF0ZSI6MTc0Nzk2ODE2N30uYTA2NWZiYjJmMzMxOTRlYWJmNTA3YzgzODc1M2MxYTZkY2ZlMTBiZWUxYjQ3MWIwODk5ZGM3ZWUyZmMxNWU2Zg',
      };

      console.log('결제창 호출 파라미터:', paymentPayload);
      window.paypleGpayPaymentRequest?.(paymentPayload);
    } catch (err) {
      console.error('결제 요청 실패:', err);
      setIsCallGpay(false);
    }
  };

  if (!orderParams) return null;

  return (
    <div className="device__layout w-600">
      <div className="line_setter">
        <h4 className="tit__device mb-32">
          <img className="logo_in_text__md" src="/images/logo_full.svg" alt="" />
          <b> 해외결제 API - 결제창 호출</b>
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
                <td>결제고객 이름</td>
                <td>
                  {orderParams.lastName} {orderParams.firstName}
                </td>
              </tr>
              <tr>
                <td>결제고객 이메일</td>
                <td>{orderParams.email}</td>
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
          <div>결제창 호출방식 : {orderParams.isDirect}</div>
          <button
            className="btn cl_main btn_rounded btn_md"
            type="button"
            id="gpayOrderFormSubmit"
            onClick={handlePaymentReq}
            disabled={isCallGpay}
          >
            해외결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
