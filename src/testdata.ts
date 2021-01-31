import { InstanceContextJson } from "./openworld/engine/datamodel/serialization/json/json-instance-context-serializer";

export const testInstanceData: InstanceContextJson = {
    "$DataModel": {
        "className": "DataModel",
        "refId": "$DataModel",
        "properties": {
            "name": "DataModel",
            "parent": {
                "instanceRef": null
            }
        }
    },
    "$World": {
        "className": "World",
        "refId": "$World",
        "properties": {
            "name": "World",
            "parent": {
                "instanceRef": "$DataModel"
            },
            "currentCamera": {
                "instanceRef": "13c570b1-b4b7-4a00-ac2d-a73847a17f2a"
            }
        }
    },
    "$ContentProvider": {
        "className": "ContentProvider",
        "refId": "$ContentProvider",
        "properties": {
            "name": "ContentProvider",
            "parent": {
                "instanceRef": "$DataModel"
            }
        }
    },
    "$Lighting": {
        "className": "Lighting",
        "refId": "$Lighting",
        "properties": {
            "name": "Lighting",
            "parent": {
                "instanceRef": "$DataModel"
            },
            "ambient": [
                0.25,
                0.25,
                0.25
            ]
        }
    },
    "$Mouse": {
        "className": "Mouse",
        "refId": "$Mouse",
        "properties": {
            "name": "Mouse",
            "parent": {
                "instanceRef": "$DataModel"
            }
        }
    },
    "$RunService": {
        "className": "RunService",
        "refId": "$RunService",
        "properties": {
            "name": "RunService",
            "parent": {
                "instanceRef": "$DataModel"
            }
        }
    },
    "13c570b1-b4b7-4a00-ac2d-a73847a17f2a": {
        "className": "Camera",
        "refId": "13c570b1-b4b7-4a00-ac2d-a73847a17f2a",
        "properties": {
            "name": "Camera",
            "parent": {
                "instanceRef": "$World"
            },
            "cframe": [
                0,
                0,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                0,
                0,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "fieldOfView": 70
        }
    },
    "8f59025e-d841-4db3-a4b9-43aee5e5c4a8": {
        "className": "Folder",
        "refId": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8",
        "properties": {
            "name": "Fancy Cubes",
            "parent": {
                "instanceRef": "$World"
            }
        }
    },
    "74f6ac6b-443e-40f6-819f-614328703b53": {
        "className": "Primitive",
        "refId": "74f6ac6b-443e-40f6-819f-614328703b53",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -11,
                0.5984232219783068,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -11,
                0.5984232219783068,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "522c1a45-2b7a-4feb-b7f7-03bb8fd4e002": {
        "className": "Primitive",
        "refId": "522c1a45-2b7a-4feb-b7f7-03bb8fd4e002",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -9.9,
                -0.4533303337659323,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -9.9,
                -0.4533303337659323,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "f029df77-2ccd-41d9-9cd2-0062688628c9": {
        "className": "Primitive",
        "refId": "f029df77-2ccd-41d9-9cd2-0062688628c9",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -8.8,
                -1.08829407128572,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -8.8,
                -1.08829407128572,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "bb885ce3-bcaf-47a4-8829-bde02644a3e1": {
        "className": "Primitive",
        "refId": "bb885ce3-bcaf-47a4-8829-bde02644a3e1",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -7.700000000000001,
                -0.722685258590668,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -7.700000000000001,
                -0.722685258590668,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "be612f12-46f9-42a8-87e6-197e10b4ccf2": {
        "className": "Primitive",
        "refId": "be612f12-46f9-42a8-87e6-197e10b4ccf2",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -6.6000000000000005,
                0.30735704801881847,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -6.6000000000000005,
                0.30735704801881847,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "caf25c39-0e34-4aba-a6cb-80957c40e0bd": {
        "className": "Primitive",
        "refId": "caf25c39-0e34-4aba-a6cb-80957c40e0bd",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -5.5,
                1.0548167021294523,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -5.5,
                1.0548167021294523,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "2afe08ce-19f4-4547-ba42-550007e063de": {
        "className": "Primitive",
        "refId": "2afe08ce-19f4-4547-ba42-550007e063de",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -4.4,
                0.8324827448387211,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -4.4,
                0.8324827448387211,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "b51b5aeb-17b6-4ad2-b524-937cd74bdf1b": {
        "className": "Primitive",
        "refId": "b51b5aeb-17b6-4ad2-b524-937cd74bdf1b",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -3.3000000000000003,
                -0.15523200886585395,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -3.3000000000000003,
                -0.15523200886585395,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "20d8d196-a18e-4109-ae77-a2f2582fb249": {
        "className": "Primitive",
        "refId": "20d8d196-a18e-4109-ae77-a2f2582fb249",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -2.2,
                -1.0002271695082499,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -2.2,
                -1.0002271695082499,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "c03c6715-9c4c-4b63-a9c4-ab1223f193cc": {
        "className": "Primitive",
        "refId": "c03c6715-9c4c-4b63-a9c4-ab1223f193cc",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                -1.1,
                -0.9256180832886862,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                -1.1,
                -0.9256180832886862,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "15ceac7a-7b9f-4026-b488-c67ea3c426db": {
        "className": "Primitive",
        "refId": "15ceac7a-7b9f-4026-b488-c67ea3c426db",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                0,
                0,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                0,
                0,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "b679d3a7-2ebb-4e0a-ad41-b8aa4d79deb2": {
        "className": "Primitive",
        "refId": "b679d3a7-2ebb-4e0a-ad41-b8aa4d79deb2",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                1.1,
                0.9256180832886862,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                1.1,
                0.9256180832886862,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "5dbdc288-af0e-4a0f-88cf-0ec99c27e55e": {
        "className": "Primitive",
        "refId": "5dbdc288-af0e-4a0f-88cf-0ec99c27e55e",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                2.2,
                1.0002271695082499,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                2.2,
                1.0002271695082499,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "e185c37e-2a7f-430a-b244-870de29f601e": {
        "className": "Primitive",
        "refId": "e185c37e-2a7f-430a-b244-870de29f601e",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                3.3000000000000003,
                0.15523200886585395,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                3.3000000000000003,
                0.15523200886585395,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "50b0050f-f478-4d34-baab-e166ae7d882f": {
        "className": "Primitive",
        "refId": "50b0050f-f478-4d34-baab-e166ae7d882f",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                4.4,
                -0.8324827448387211,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                4.4,
                -0.8324827448387211,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "9abe8117-529e-4c68-84f0-2d63825f6dd2": {
        "className": "Primitive",
        "refId": "9abe8117-529e-4c68-84f0-2d63825f6dd2",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                5.5,
                -1.0548167021294523,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                5.5,
                -1.0548167021294523,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "2fe6b43c-b2d3-4fe7-978b-01ccb9a01a2a": {
        "className": "Primitive",
        "refId": "2fe6b43c-b2d3-4fe7-978b-01ccb9a01a2a",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                6.6000000000000005,
                -0.30735704801881847,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                6.6000000000000005,
                -0.30735704801881847,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "17038338-5828-42b2-bec5-6690afe81dfc": {
        "className": "Primitive",
        "refId": "17038338-5828-42b2-bec5-6690afe81dfc",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                7.700000000000001,
                0.722685258590668,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                7.700000000000001,
                0.722685258590668,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "f2364c4e-5e84-4c25-988d-af72d8d8c69f": {
        "className": "Primitive",
        "refId": "f2364c4e-5e84-4c25-988d-af72d8d8c69f",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                8.8,
                1.08829407128572,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                8.8,
                1.08829407128572,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "3e6f7f98-57d9-454c-a28e-bc2fac64d664": {
        "className": "Primitive",
        "refId": "3e6f7f98-57d9-454c-a28e-bc2fac64d664",
        "properties": {
            "name": "Primitive",
            "parent": {
                "instanceRef": "8f59025e-d841-4db3-a4b9-43aee5e5c4a8"
            },
            "cframe": [
                9.9,
                0.4533303337659323,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                9.9,
                0.4533303337659323,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": {
                    "content": "a1172ed0-2c80-4190-9edd-eae2e978238c"
                },
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                1,
                1,
                1
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "315c16fa-14c9-426c-b15d-f5e40a1fa8db": {
        "className": "Primitive",
        "refId": "315c16fa-14c9-426c-b15d-f5e40a1fa8db",
        "properties": {
            "name": "base",
            "parent": {
                "instanceRef": "$World"
            },
            "cframe": [
                0,
                -3.5,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                0,
                -3.5,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "type": "Cube",
            "material": {
                "color": [
                    1,
                    1,
                    1
                ],
                "metalness": 0,
                "roughness": 1,
                "normal": null
            },
            "size": [
                25,
                0.5,
                25
            ],
            "receivesShadows": true,
            "castsShadows": true
        }
    },
    "a820e60e-9344-40e3-bad3-2ca465cbdd9a": {
        "className": "PointLight",
        "refId": "a820e60e-9344-40e3-bad3-2ca465cbdd9a",
        "properties": {
            "name": "PointLight",
            "parent": {
                "instanceRef": "$World"
            },
            "cframe": [
                0,
                6,
                0,
                0,
                0,
                0,
                1
            ],
            "position": [
                0,
                6,
                0
            ],
            "rotation": [
                0,
                0,
                0,
                1
            ],
            "brightness": 5,
            "color": [
                1,
                1,
                1
            ],
            "castsShadows": true,
            "range": 15
        }
    },
    "ae079162-9dff-4fe8-bcf5-c6cb3f753a7b": {
        "className": "Sky",
        "refId": "ae079162-9dff-4fe8-bcf5-c6cb3f753a7b",
        "properties": {
            "name": "Sky",
            "parent": {
                "instanceRef": "$Lighting"
            },
            "skyboxTop": {
                "content": "skybox3_py"
            },
            "skyboxBottom": {
                "content": "skybox3_ny"
            },
            "skyboxLeft": {
                "content": "skybox3_nx"
            },
            "skyboxRight": {
                "content": "skybox3_px"
            },
            "skyboxFront": {
                "content": "skybox3_pz"
            },
            "skyboxBack": {
                "content": "skybox3_nz"
            }
        }
    },
    "13dafc92-67b3-40cc-a50f-3aa59048d8fc": {
        "className": "ClientScript",
        "refId": "13dafc92-67b3-40cc-a50f-3aa59048d8fc",
        "properties": {
            "name": "ClientScript",
            "parent": {
                "instanceRef": "$World"
            },
            "language": "JavaScript",
            "source": "let mouseSensitivity = new Vector2(1, 1);\nlet radius = 8.0;\nlet radiusMin = 1.0;\nlet radiusMax = 30.0;\nlet theta = 0.0;\nlet phi = 0.0;\nlet phiMin = -85;\nlet phiMax = 85;\nconst camTarget = new Vector3(0, 0, 0);\n\nconst mouse = dataModel.getService(Mouse);\nconst runService = dataModel.getService(RunService);\n\nrunner.addSignalConnection(\n    mouse.wheelDown.connect(() => {\n        radius += 1.0;\n        radius = MathEx.clamp(radius, radiusMin, radiusMax);\n    }));\n\nrunner.addSignalConnection(\n    mouse.wheelUp.connect(() => {        \n        radius -= 1.0;\n        radius = MathEx.clamp(radius, radiusMin, radiusMax);\n    }));\n\nrunner.addSignalConnection(\n    mouse.move.connect((deltaX, deltaY) => {\n        if (!mouse.isRightButtonDown) {\nreturn;\n        }\n\n        theta -= deltaX * (mouseSensitivity.x / 2.0);\n        theta %= 360;\n\n        phi += deltaY * (mouseSensitivity.y / 2.0);\n        phi = MathEx.clamp(phi, phiMin, phiMax);\n    }));\n\nrunner.addSignalConnection(\n    runService.preSimulation.connect(() => {\n        if (world.currentCamera === null) {\nreturn;\n        }\n\n        let cameraPosition =\nnew Vector3(\n    Math.sin(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad),\n    Math.sin(phi * MathEx.deg2rad),\n    Math.cos(theta * MathEx.deg2rad) * Math.cos(phi * MathEx.deg2rad));\n\n        cameraPosition = Vector3.multiplyScalar(cameraPosition, radius);\n        cameraPosition = Vector3.add(cameraPosition, camTarget);\n    \n        world.currentCamera.cframe = CFrame.createLookAt(cameraPosition, camTarget);\n    }));\n"
        }
    }
};