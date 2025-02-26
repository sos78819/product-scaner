import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from "dayjs";



export default function BasicTable({ head, rows }) {
    return (
        <TableContainer sx={{ maxWidth: 500, mb: 5 }} component={Paper}>
            <Table sx={{ minWidth: 460 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">上傳時間</TableCell>
                        <TableCell align="right">產品</TableCell>
                        <TableCell align="right">QrcodeId</TableCell>
                        <TableCell align="right">狀態</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.qrcodeid}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right">{dayjs(row.update_ymdtime).format("YYYY-MM-DD")}</TableCell>
                            <TableCell align="right">{row.product_name}</TableCell>
                            <TableCell align="right">{row.qrcodeid}</TableCell>
                            <TableCell align="right">{
                                row.original_status === "0" ? "未使用" :
                                row.original_status === "1" ? "已使用" :
                                row.original_status === "2" ? "已退貨" :
                                            "未知狀態"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
