import 'reflect-metadata';
import './index.css';
import 'simplebar/dist/simplebar.min.css';
import * as React from 'react';
import DataModelUtils from './openworld/engine/datamodel/utils/DataModelUtils';
import EditorApp from './openworld/editor/components/editor-app';
import { render } from 'react-dom';

DataModelUtils.initialiseMetaData();

render(
    <EditorApp />,   
    document.getElementById('root')
);
