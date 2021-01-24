import React, { useEffect, useState } from 'react';
import { Input, Grid, InputAdornment } from '@material-ui/core';
import Vector3 from '../../../../engine/math/vector3';

type Props = {
    value: Vector3;
    onChange?: (newValue: Vector3) => void;
};

export function Vector3InputField(props: Props) {
    const { value, onChange } = props;

    const [ xValue, setXValue ] = useState(value.x);
    useEffect(() => setXValue(value.x), [ value ]);

    const [ yValue, setYValue ] = useState(value.y);
    useEffect(() => setXValue(value.y), [ value ]);

    const [ zValue, setZValue ] = useState(value.z);
    useEffect(() => setXValue(value.z), [ value ]);

    useEffect(() => {
        const newValue = new Vector3(xValue, yValue, zValue);
        if (onChange !== undefined) {
            onChange(newValue);
        }
    }, [ xValue, yValue, zValue ]);

    const onXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setXValue(Number.parseFloat(event.target.value));
    };

    const onYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYValue(Number.parseFloat(event.target.value));
    };

    const onZChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setZValue(Number.parseFloat(event.target.value));
    };

    return (
        <Grid
            container
            spacing={1}
        >
            <Grid
                item
                xs={4}
            >
                <Input
                    type='number'
                    fullWidth
                    value={xValue}
                    onChange={onXChange}
                    startAdornment={<InputAdornment position="start">X</InputAdornment>}
                />
            </Grid>

            <Grid
                item
                xs={4}
            >
                <Input
                    type='number'
                    fullWidth
                    value={yValue}
                    onChange={onYChange}
                    startAdornment={<InputAdornment position="start">Y</InputAdornment>}
                />
            </Grid>

            <Grid
                item
                xs={4}
            >
                <Input
                    type='number'
                    fullWidth
                    value={zValue}
                    onChange={onZChange}
                    startAdornment={<InputAdornment position="start">Z</InputAdornment>}
                />
            </Grid>
        </Grid>
    );
}