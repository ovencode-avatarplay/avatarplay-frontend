'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

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

function Order() {
  const router = useRouter();
  const [simpleShortStatus, setSimpleShortStatus] = useState(false);
  const [orderParams, setOrderParams] = useState<OrderParams>({
    isSimpleShort: '',
    billing_key: '',
    securityCode: '',
    isDirect: 'N',
    service_oid: createOid(),
    comments: 'Payple global payments',
    totalAmount: '1.00',
    currency: 'USD',
    lastName: 'Inc',
    firstName: 'Payple',
    email: 'test@payple.kr',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setOrderParams(prev => ({...prev, [name]: value}));

    if (name === 'isSimpleShort') {
      setSimpleShortStatus(value === 'Y');
    }
  };

  const handleSubmit = () => {
    const navigatePath =
      orderParams.isSimpleShort === 'Y' && orderParams.billing_key ? '/store/orderbillingKey' : '../store/orderconfirm';

    // ✅ 데이터를 문자열로 인코딩해서 쿼리로 넘김

    const query = encodeURIComponent(JSON.stringify(orderParams));
    router.push(`${navigatePath}?q=${query}`);
  };

  return (
    <div className="device__layout w-600">
      <div className="line_setter">
        <form id="orderForm" name="orderForm">
          <h4 className="tit__device">
            <img className="logo_in_text__md" src="/images/logo_full.svg" alt="" />
            <b>해외결제 API</b>
          </h4>

          {/* 결제창 설정 */}
          <div className="tit--by-page">
            <h3 className="tit_component">결제창 설정</h3>
          </div>
          <div className="ctn--by-page">
            <div className="form_box has_border w240">
              <div className="tit__form_box fcl_txt fw_bd">빌링키 결제</div>
              <div className="tit__form_box fsz_08">isSimpleShort</div>
              <div className="ctn__form_box">
                <select name="isSimpleShort" value={orderParams.isSimpleShort} onChange={handleFormChange}>
                  <option value="">일반결제</option>
                  <option value="Y">간편 빌링키 결제</option>
                </select>
              </div>
            </div>

            {simpleShortStatus && (
              <>
                <div className="form_box has_border w240">
                  <div className="tit__form_box fcl_txt fw_bd">빌링키</div>
                  <div className="tit__form_box fsz_08">billing_key</div>
                  <div className="ctn__form_box">
                    <input
                      type="text"
                      name="billing_key"
                      value={orderParams.billing_key}
                      onChange={handleFormChange}
                      className="ipt"
                    />
                  </div>
                </div>
                <div className="form_box has_border w240">
                  <div className="tit__form_box fcl_txt fw_bd">CVC/CVV</div>
                  <div className="tit__form_box fsz_08">securityCode</div>
                  <div className="ctn__form_box">
                    <input
                      type="text"
                      name="securityCode"
                      maxLength={3}
                      value={orderParams.securityCode}
                      onChange={handleFormChange}
                      className="ipt"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form_box has_border w240">
              <div className="tit__form_box fcl_txt fw_bd">결제창 호출 방식</div>
              <div className="tit__form_box fsz_08">isDirect</div>
              <div className="ctn__form_box">
                <select name="isDirect" value={orderParams.isDirect} onChange={handleFormChange}>
                  <option value="N">팝업</option>
                  <option value="Y">다이렉트</option>
                </select>
              </div>
            </div>
          </div>

          {/* 결제정보 설정 */}
          <div className="tit--by-page">
            <h3 className="tit_component">결제정보 설정</h3>
          </div>
          <div className="ctn--by-page">
            {[
              {label: '주문번호', name: 'service_oid'},
              {label: '상품명', name: 'comments'},
              {label: '결제금액', name: 'totalAmount'},
              {label: '결제통화', name: 'currency', readOnly: true},
              {label: '고객 성', name: 'lastName'},
              {label: '고객 이름', name: 'firstName'},
              {label: '고객 이메일', name: 'email'},
            ].map(field => (
              <div className="form_box has_border w240" key={field.name}>
                <div className="tit__form_box fcl_txt fw_bd">{field.label}</div>
                <div className="tit__form_box fsz_08">{field.name}</div>
                <div className="ctn__form_box">
                  <input
                    className="ipt"
                    type="text"
                    name={field.name}
                    value={orderParams[field.name as keyof OrderParams]}
                    onChange={handleFormChange}
                    readOnly={field.readOnly}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="btn_box has_space align_center">
            <button className="btn cl_main btn_rounded btn_md" type="button" id="orderSubmit" onClick={handleSubmit}>
              다음단계
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const createOid = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `PaypleGpayTest-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${now.getTime()}`;
};

export default Order;
