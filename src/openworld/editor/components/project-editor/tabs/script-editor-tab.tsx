import BaseScript from '../../../../engine/datamodel/elements/base-script';
import React, { useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { useProjectEditorTabContext } from '../../../core/contexts/project-editor-tab-context';
import { useProjectEditorContext } from '../../../core/contexts/project-editor-context';

export type ScriptEditorTabProps = {
    script: BaseScript
};

export default function ScriptEditorTab(props: ScriptEditorTabProps) {
    const { script } = props;

    const projectEditorContext = useProjectEditorContext();
    const tab = useProjectEditorTabContext();

    useEffect(() => {
        tab.onClose = () => {
            projectEditorContext.removeTab(tab);
        }
        projectEditorContext.updateTab(tab);

        return () => {
            tab.onClose = undefined;
            projectEditorContext.updateTab(tab);
        };

    }, [ projectEditorContext, tab ]);

    return (
        <SimpleBar style={{ display: 'flex', flex: '1' }}>
            <pre>{script.source}</pre>
        </SimpleBar>
    );
}