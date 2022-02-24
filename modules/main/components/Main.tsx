import React from "react";
import Link from "next/link";

interface Props {
  Component: React.ComponentType<any>; // router component
  pageProps: object; // router component props
}

const Index = (props: Props) => {
  const {  Component, pageProps } = props;
  return (
    <div>
        <div>
        <Link href="/">
            <a style={{ color: "#000", fontSize: 30 }}>xxxx</a>
          </Link>
          &nbsp;&nbsp;
          <Link href="/home">
            <a style={{ color: "#000", fontSize: 30 }}>home</a>
          </Link>
          &nbsp;&nbsp;
          <Link href="/about">
            <a style={{ color: "#000", fontSize: 30 }}>about</a>
          </Link>
        </div>
        <Component {...pageProps} />
    </div>
  );
};

export default Index
