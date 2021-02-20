import "reflect-metadata";
import LocalClientScriptThreadContext from "../datamodel/context/local-client-script-thread-context";
import DataModelUtils from "../../engine/datamodel/utils/data-model-utils";
import InterThreadCommunication from "../../engine/threading/inter-thread-communication";

DataModelUtils.initialiseMetaData();

(async () => {
    const comms = new InterThreadCommunication(globalThis as any);

    const context = new LocalClientScriptThreadContext(comms);
    await context.whenSynchronized();
})();