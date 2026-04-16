---
title: "Serializable and the significance of serialVersionUID."
category: "miscellaneous"
order: 1
---

**Serializable** is a marker interface that tells the JVM that an object can be converted into a bitstream.

### serialVersionUID:
- A unique ID used during deserialization to verify that the sender and receiver of a serialized object have loaded classes for that object that are compatible.
- If the receiver has loaded a class for the object that has a different `serialVersionUID` than the sender, then deserialization will result in an `InvalidClassException`.
- **Best Practice**: Always define a static final long `serialVersionUID` to ensure cross-version compatibility.
