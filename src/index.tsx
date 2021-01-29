import 'reflect-metadata';
import './index.css';
import * as React from 'react';
import DataModelUtils from './openworld/engine/datamodel/utils/DataModelUtils';
import JsonInstanceContextSerializer from './openworld/engine/datamodel/serialization/json/json-instance-context-serializer';
import LocalClientInstanceContext from './openworld/client/contexts/local-client-instance-context';
import OpenWorldEditor from './openworld/editor/components/open-world-editor';
import { render } from 'react-dom';
import { testInstanceData } from './testdata';

DataModelUtils.initialiseMetaData();

const instanceContext = new LocalClientInstanceContext();
JsonInstanceContextSerializer.deserializeObject(testInstanceData, instanceContext);

render(
    <OpenWorldEditor instanceContext={instanceContext} />,   
    document.getElementById('root')
);
