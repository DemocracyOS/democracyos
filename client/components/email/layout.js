import React from 'react'
import { Table, TBody, TR, TD } from 'oy-vey'

export default (props) => {
  return (
    <Table
      width="100%"
      align="center"
      style={{ WebkitTextSizeAdjust: '100%', msTextSizeAdjust: '100%', msoTableLspace: '0pt', msoTableRspace: '0pt', borderCollapse: 'collapse', margin: '0px auto' }}>
      <TBody>
        <TR>
          <TD align="center">

            {/* Centered column */}
            <Table
              width="600"
              align="center"
              style={{ WebkitTextSizeAdjust: '100%', msTextSizeAdjust: '100%', msoTableLspace: '0pt', msoTableRspace: '0pt', borderCollapse: 'collapse', margin: '0px auto' }}>
              <TBody>
                <TR>
                  <TD>
                    {props.children}
                  </TD>
                </TR>
              </TBody>
            </Table>

          </TD>
        </TR>

      </TBody>
    </Table>
  )
}
