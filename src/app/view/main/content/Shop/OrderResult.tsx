'use client';

import React, {useEffect, useState} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import axios from 'axios';

interface OrderResultParams {
  type?: string;
  result?: string;
  message?: string;
  resultUrl?: string;
  api_id?: string;
  api_date?: string;
  service_oid?: string;
  comments?: string;
  pay_type?: string;
  card_number?: string;
  totalAmount?: string;
  currency?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  billing_key?: string;
  submitTimeUtc?: string;
}

function OrderResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderParams, setOrderParams] = useState<OrderResultParams | null>(null);
  const [cancelResponse, setCancelResponse] = useState<Record<string, string> | null>(null);
  const [cancelButtonDisabled, setCancelButtonDisabled] = useState(false);

  useEffect(() => {
    const search = searchParams.toString();
    if (!search) {
      router.push('../store/order');
      return;
    }
    try {
      const decoded = JSON.parse(decodeURIComponent(search));
      setOrderParams(decoded);
    } catch (err) {
      console.error('Failed to parse order params:', err);
      router.push('../store/order');
    }
  }, [searchParams, router]);

  const cancelReq = async () => {
    if (!orderParams || !orderParams.api_id || !orderParams.service_oid) return;

    const confirmCancel = window.confirm('승인취소요청을 전송합니다. 진행하시겠습니까?');
    if (!confirmCancel) return;

    setCancelButtonDisabled(true);

    try {
      const {data} = await axios.post('/api/cancel', {
        comments: orderParams.comments,
        service_oid: orderParams.service_oid,
        pay_id: orderParams.api_id,
        totalAmount: orderParams.totalAmount,
        currency: orderParams.currency,
        resultUrl: process.env.NEXT_PUBLIC_SERVER_HOSTNAME + '/api/result',
      });

      if (data.result === 'A0000') {
        alert(data.message);
      } else {
        alert(data.message || '승인취소 요청 실패');
      }

      setCancelResponse(data);
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  if (!orderParams) return null;

  return (
    <div className="device__layout w-600" id="responseBody">
      <div className="line_setter">
        <h4 className="tit__device mb-32">
          <img className="logo_in_text__md" src="/images/logo_full.svg" alt="" />
          <b>해외결제 API - 결제결과</b>
        </h4>

        <div id="payResTable">
          <b>Response (일반결제 결과)</b>
          <div className="table-outter" id="payResult">
            <table className="model-01">
              <thead>
                <tr>
                  <th>파라미터 항목</th>
                  <th>파라미터 값</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(orderParams).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orderParams.result === 'A0000' && (
            <div className="btn_box has_space align_center">
              <button
                className="btn cl_main btn_rounded btn_md"
                type="button"
                onClick={cancelReq}
                disabled={cancelButtonDisabled}
              >
                결제승인취소
              </button>
            </div>
          )}
        </div>

        <br />
        <b>Response (취소 결과)</b>
        <div className="table-outter">
          <table className="model-01" id="payRefundResult">
            <thead>
              <tr>
                <th>파라미터 항목</th>
                <th>파라미터 값</th>
              </tr>
            </thead>
            <tbody>
              {cancelResponse &&
                Object.entries(cancelResponse).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderResult;
