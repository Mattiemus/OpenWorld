import AppsIcon from '@material-ui/icons/Apps';
import Camera from '../../../engine/datamodel/elements/camera';
import ClientScript from '../../../engine/datamodel/elements/client-script';
import CodeIcon from '@material-ui/icons/Code';
import ContentProvider from '../../../engine/datamodel/services/content-provider';
import CubeIcon from '../icons/CubeIcon';
import DataModel from '../../../engine/datamodel/elements/datamodel';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import FlareIcon from '@material-ui/icons/Flare';
import Folder from '../../../engine/datamodel/elements/folder';
import Instance from '../../../engine/datamodel/elements/instance';
import Lighting from '../../../engine/datamodel/services/lighting';
import Mouse from '../../../engine/datamodel/services/mouse';
import MouseIcon from '@material-ui/icons/Mouse';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import OpenFolderIcon from '../icons/OpenFolderIcon';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PointLight from '../../../engine/datamodel/elements/point-light';
import Primitive from '../../../engine/datamodel/elements/primitive';
import PublicIcon from '@material-ui/icons/Public';
import React from 'react';
import RunService from '../../../engine/datamodel/services/run-service';
import Sky from '../../../engine/datamodel/elements/sky';
import VideocamIcon from '@material-ui/icons/Videocam';
import WorkIcon from '@material-ui/icons/Work';
import World from '../../../engine/datamodel/services/world';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

type Props = {
    instance: Instance | null;
} & SvgIconProps;

const InstanceIcon = React.memo((props: Props) => {
    const { instance, ...otherProps } = props;

    //
    // Elements
    //

    if (instance instanceof Camera) {        
        return <VideocamIcon {...otherProps} />;
    }

    if (instance instanceof ClientScript) {
        return <CodeIcon {...otherProps} />;
    }

    if (instance instanceof DataModel) {        
        return <AppsIcon {...otherProps} />;
    }  

    if (instance instanceof Folder) {
        return <OpenFolderIcon {...otherProps} />;
    }  

    if (instance instanceof PointLight) {        
        return <FlareIcon {...otherProps} />;
    }

    if (instance instanceof Primitive) {
        return <CubeIcon {...otherProps} />
    }

    if (instance instanceof Sky) {
        return <NightsStayIcon {...otherProps} />;
    }

    //
    // Services
    //

    if (instance instanceof ContentProvider) {
        return <WorkIcon {...otherProps} />
    }

    if (instance instanceof Lighting) {
        return <EmojiObjectsIcon {...otherProps} />;
    }

    if (instance instanceof Mouse) {
        return <MouseIcon {...otherProps} />;
    }

    if (instance instanceof RunService) {
        return <PlayArrowIcon {...otherProps} />;
    }

    if (instance instanceof World) {
        return <PublicIcon {...otherProps} />;
    }

    return null;
});
export default InstanceIcon;
