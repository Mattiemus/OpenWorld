import ContentProviderImpl from '../../../engine/datamodel/services/impl/content-provider-impl';
import LightingImpl from '../../../engine/datamodel/services/impl/lighting-impl';
import MouseImpl from '../../../engine/datamodel/services/impl/mouse-impl';
import NullContentProviderImpl from '../../../engine/datamodel/services/impl/null/null-content-provider-impl';
import NullLightingImpl from '../../../engine/datamodel/services/impl/null/null-lighting-impl';
import RunServiceImpl from '../../../engine/datamodel/services/impl/run-service-impl';
import ScriptThreadWorldImpl from '../services/script-thread/script-thread-world-impl';
import WorkerThreadInstanceContext from '../../../engine/threading/contexts/worker-thread/worker-thread-instance-context';
import WorkerThreadMouseImpl from '../../../engine/threading/contexts/worker-thread/services/worker-thread-mouse-impl';
import WorkerThreadRunServiceImpl from '../../../engine/threading/contexts/worker-thread/services/worker-thread-run-service-impl';
import WorldImpl from '../../../engine/datamodel/services/impl/world-impl';
import { Container } from 'inversify';

export default class LocalClientScriptThreadContext extends WorkerThreadInstanceContext 
{
    protected setupContainer(container: Container): void {
        super.setupContainer(container);

        container.bind('ScriptThreadWorldImpl').to(ScriptThreadWorldImpl).inSingletonScope();
        container.bind(WorldImpl).toService('ScriptThreadWorldImpl');

        container.bind('NullContentProviderImpl').to(NullContentProviderImpl).inSingletonScope();
        container.bind(ContentProviderImpl).toService('NullContentProviderImpl');

        container.bind('NullLightingImpl').to(NullLightingImpl).inSingletonScope();
        container.bind(LightingImpl).toService('NullLightingImpl');

        // TODO: client replicator

        container.bind('WorkerThreadMouseImpl').to(WorkerThreadMouseImpl).inSingletonScope();
        container.bind(MouseImpl).toService('WorkerThreadMouseImpl');

        container.bind('WorkerThreadRunServiceImpl').to(WorkerThreadRunServiceImpl).inSingletonScope();
        container.bind(RunServiceImpl).toService('WorkerThreadRunServiceImpl');
    }
}