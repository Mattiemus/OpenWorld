import Project from '../core/models/project';
import ProjectEditor from './project-editor/project-editor';
import React from 'react';
import useConstant from '../core/hooks/use-constant';
import { testInstanceData } from '../../../testdata';

//
// Components
//

export type EditorBodyProps = {
};

export default function EditorBody(props: EditorBodyProps) {
    const project = useConstant(() => {
        const p = new Project();
        p.data = testInstanceData;
        return p;
    });

    return (
        <ProjectEditor project={project} />
    );
}