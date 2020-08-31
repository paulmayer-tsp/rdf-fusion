import React, { useEffect, useState } from 'react';
import styles from './StatsComponent.module.scss'
import { AssetSummaryGraph } from 'components';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Button,
  TableRow,
} from '@material-ui/core';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


export interface StatsPageComponentProps {
  readonly dumm?: boolean;
  readonly data?: any;
  readonly result?: any;
}

interface StatsPageComponentState {
  readonly open: boolean;
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }),
)(TableRow);

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
  }),
);

const StatsPageComponent: React.FC<StatsPageComponentProps> = (props) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [tableData, saveTabledata] = React.useState<any>({})
  const classes = useStyles();
  const {
    result,
    data,
  } = props

  useEffect(() => {
    //count the total number of result sets using
    // the total number of occurences of events timestamps.
    const tableData1 = result.reduce((acc, res) => {
      if (`${res}`.startsWith('[')) {
        const [starttime, endtime] = `${res.substring(1, res.length - 2)}`.split(',')
        acc.values[acc.values.length - 1].push(starttime, endtime)

        //create the 2nd dimension new array here
        acc.values.push([])
        acc.resultNumberSet = acc.resultNumberSet + 1
      } else if (`${res}`.startsWith('?')) {
        const [header, ...value] = `${res.substring(1, res.length - 1)}`.split(' ')
        acc.headers[header] = true
        acc.values[acc.values.length - 1].push(value.join(' '))
      }
      return acc
    }, {
      values: [[]],
      resultNumberSet: 0,
      headers: {},
    })

    saveTabledata(tableData1)
  }, [result])

  const effect = useEffect(() => {
    localStorage['reload'] = true
  }, [])

  const anotherGenerate = (base64Img, name) => {
    let doc = new jsPDF('l', 'cm', 'a4');
    doc.addImage(base64Img, 'png', 0.5, 0.5, 28.7, 25)
    doc.save(`${name}.pdf`);
  }

  const pdfGenerate = () => {
    //@ts-ignore
    html2canvas(document.querySelector("#content")).then(canvas => {
      // document.body.appendChild(canvas)
      anotherGenerate(canvas.toDataURL("image/png;base64"), 'results')
    });
  }

  let {
    resultNumberSet,
    headers = {},
    values = [],
  } = tableData

  headers = {
    ...headers,
    StartTime: true,
    EndTime: true,
  }


  return (
    <div className={styles.container}>
      <Typography
        className={styles.heading}
        variant={'h2'}
        align='center'
      >
        Statistics on queried data
      </Typography>
      <AssetSummaryGraph data={data} />
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* <StyledTableCell>Dessert (100g serving)</StyledTableCell> */}
              {Object.keys(headers).map(key => (
                <StyledTableCell align="left">{key}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map(row => (
              <StyledTableRow key={row.name}>
                {row.map(rowItem => (
                  <StyledTableCell align="left">{rowItem}</StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Button variant={'contained'} onClick={pdfGenerate} className={styles.btn_download}>
        Download results in PDF format
      </Button>
    </div>
  );
}

export {
  StatsPageComponent as StatsPage
}
