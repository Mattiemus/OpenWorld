import InstanceContextRenderCanvas from '../../../../client-shared/components/instance-context-render-canvas';
import React from 'react';
import { useProjectEditorInstanceContext } from '../../../core/contexts/project-editor-context';

//
// Component
//

export type SceneEditorTabProps = {
};

export default function SceneEditorTab(props: SceneEditorTabProps) {
    const editorInstanceContext = useProjectEditorInstanceContext();

    return (
        <InstanceContextRenderCanvas
            instanceContext={editorInstanceContext} />
    );
}