import GithubOutlined from '@ant-design/icons/GithubOutlined';
import Card from 'antd/lib/card';
import Image from 'antd/lib/image';
import Space from 'antd/lib/space';
import Typography from 'antd/lib/typography';
import RcFooter from 'rc-footer';
import React from 'react';
import logo from '~assets/logo.png';

function Refblock(): JSX.Element {
    return (
        <RcFooter
            columnLayout="space-between"
            columns={[
                {
                    title: (
                        <Space
                            align="start"
                            size={20}
                        >
                            <Image
                                preview={false}
                                src={logo}
                                width={48}
                            />
                            <Space
                                direction="vertical"
                                size={0}
                                style={{ textAlign: 'left' }}
                            >
                                <Typography.Text style={{ color: 'white' }}>
                                    DFK Tools
                                </Typography.Text>
                                <Typography.Text style={{ color: '#b9b9b9', fontSize: '0.875rem', fontWeight: 'normal' }}>
                                    Created for the DFK community
                                </Typography.Text>
                            </Space>
                        </Space>
                    )
                },
                {
                    title: 'Defi Kingdoms',
                    items: [
                        { title: 'Website', openExternal: true, url: 'https://defikingdoms.com' },
                        { title: 'Game', openExternal: true, url: 'https://game.defikingdoms.com' },
                        { title: 'Game (beta)', openExternal: true, url: 'https://beta.defikingdoms.com' }
                    ]
                },
                {
                    title: 'Resources',
                    items: [
                        {
                            icon: <GithubOutlined />,
                            openExternal: true,
                            title: 'Source code',
                            url: 'https://github.com/dfk-tools/dfk-tools'
                        }
                    ]
                }
            ]}
            style={{ paddingLeft: '20px', paddingRight: '20px' }}
            theme="dark"
        />
    )
}

export default Refblock;
