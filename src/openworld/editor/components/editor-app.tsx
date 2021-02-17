import Project from '../core/models/project';
import ProjectEditor from './project-editor/project-editor';
import React from 'react';
import useConstant from '../core/hooks/use-constant';
import { testInstanceData } from '../../../testdata';

//
// Components
//

export type EditorAppProps = {
};

export default function EditorApp(props: EditorAppProps) {
    const project = useConstant(() => {
        const proj = new Project();
        proj.data = testInstanceData;
        return proj;
    });

    return (
        <ProjectEditor project={project} />
    );
}