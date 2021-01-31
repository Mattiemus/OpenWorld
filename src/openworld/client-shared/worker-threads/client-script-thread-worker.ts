import "reflect-metadata";
import LocalClientScriptThreadContext from "../instance-contexts/local-client-script-thread-context";
import DataModelUtils from "../../engine/datamodel/utils/DataModelUtils";
import InterThreadCommunication from "../../engine/threading/inter-thread-communication";

DataModelUtils.initialiseMetaData();

(async () => {
    const comms = new InterThreadCommunication(globalThis as any);

    const context = new LocalClientScriptThreadContext(comms);
    await context.whenSynchronized();
})();