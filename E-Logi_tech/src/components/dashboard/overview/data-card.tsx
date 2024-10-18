import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export interface DataProps {
  Heading: string;
  sx?: SxProps;
  value: string;
  icon: React.ElementType;
}

export function DataCard({ Heading, sx, value, icon: Icon }: DataProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        {/* <Stack spacing={3}> */}
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {Heading}
              </Typography>
              <Typography variant="h3" textAlign={'center'}>
                {value}
              </Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <Icon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        {/* </Stack> */}
      </CardContent>
    </Card>
  );
}
