import React from 'react'
import Header from './header/Header'
import Content from './content/Content'
import Footer from './footer/Footer'

import './Main.css';

const Main: React.FC = () => {
  return (
    <div className="main">
      <Header />
      <Content>
      </Content>
      <Footer />
    </div>
  )
}

export default Main
