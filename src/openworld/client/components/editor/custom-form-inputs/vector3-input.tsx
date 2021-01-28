import React from 'react';
import Vector3 from '../../../../engine/math/vector3';
import { Grid, Input, InputAdornment } from '@material-ui/core';

export type Vector3InputProps = {
    value: Vector3;
    disabled?: boolean;
    onChange?: (newValue: Vector3) => void;
};

export default function Vector3Input(props: Vector3InputProps) {
    const { value, disabled, onChange } = props;

    const handleValueChange = (newValue: Vector3) => {
        if (onChange !== undefined) {
            onChange(newValue);
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Input
                    type='number'
                    fullWidth
                    disabled={disabled}
                    value={value.x}
                    onChange={(e) => {
                        const newValue = Number.parseFloat(e.target.value);
                        if (!Number.isNaN(newValue)) {
                            handleValueChange(new Vector3(newValue, value.y, value.z));
                        }
                    }}
                    startAdornment={<InputAdornment position="start">X</InputAdornment>}
                />
            </Grid>

            <Grid item xs={4}>
                <Input
                    type='number'
                    fullWidth
                    disabled={disabled}
                    value={value.y}
                    onChange={(e) => {
                        const newValue = Number.parseFloat(e.target.value);
                        if (!Number.isNaN(newValue)) {
                            handleValueChange(new Vector3(value.x, newValue, value.z));
                        }
                    }}
                    startAdornment={<InputAdornment position="start">Y</InputAdornment>}
                />
            </Grid>

            <Grid item xs={4}>
                <Input
                    type='number'
                    fullWidth
                    disabled={disabled}
                    value={value.z}
                    onChange={(e) => {
                        const newValue = Number.parseFloat(e.target.value);
                        if (!Number.isNaN(newValue)) {
                            handleValueChange(new Vector3(value.x, value.y, newValue));
                        }
                    }}
                    startAdornment={<InputAdornment position="start">Z</InputAdornment>}
                />
            </Grid>
        </Grid>
    );
}