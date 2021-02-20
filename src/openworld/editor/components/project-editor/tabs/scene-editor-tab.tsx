import InstanceContextRenderCanvas from '../../../../client-shared/components/instance-context-render-canvas';
import React, { useEffect } from 'react';
import { useProjectEditorInstanceContext, useProjectEditorContext } from '../../../core/contexts/project-editor-context';
import useObservable from '../../../core/hooks/use-observable';

//
// Component
//

export type SceneEditorTabProps = {
};

export default function SceneEditorTab(props: SceneEditorTabProps) {
    const projectEditorContext = useProjectEditorContext();
    const editorInstanceContext = useProjectEditorInstanceContext();

    const hoverInstance = useObservable(
        editorInstanceContext.editorRaycaster.hoverInstance$,
        editorInstanceContext.editorRaycaster.hoverInstance
    );

    useEffect(() => {
        if (hoverInstance !== undefined) {
            projectEditorContext.selectedInstaces = [ hoverInstance ];
        }
    }, [ hoverInstance ]);

    return (
        <InstanceContextRenderCanvas
            instanceContext={editorInstanceContext} />
    );
}