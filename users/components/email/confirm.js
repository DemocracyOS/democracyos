import React from 'react'
import { Table, TBody, TR, TD } from 'oy-vey'
import Layout from '../../../client/components/email/layout'

export default {
  html: ({ url }) => {
    const textStyle = {
      color: '#42444c',
      backgroundColor: '#eeeeee',
      fontFamily: 'Arial',
      fontSize: '18px'
    }

    return (
      <Layout>
        <Table width="100%">
          <TBody>
            <TR>
              <TD
                align="center"
                style={textStyle}>
                Confirmar email {url}
              </TD>
            </TR>
          </TBody>
        </Table>
      </Layout>
    )
  },
  text: `Confirmar email`
}
