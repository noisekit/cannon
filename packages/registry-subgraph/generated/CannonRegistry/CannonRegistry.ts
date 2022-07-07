// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class PackagePublish extends ethereum.Event {
  get params(): PackagePublish__Params {
    return new ProtocolPublish__Params(this);
  }
}

export class PackagePublish__Params {
  _event: PackagePublish;

  constructor(event: PackagePublish) {
    this._event = event;
  }

  get name(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get version(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get tags(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get url(): string {
    return this._event.parameters[3].value.toString();
  }

  get owner(): Address {
    return this._event.parameters[4].value.toAddress();
  }
}

export class CannonRegistry extends ethereum.SmartContract {
  static bind(address: Address): CannonRegistry {
    return new CannonRegistry("CannonRegistry", address);
  }

  getPackages(): Array<Bytes> {
    let result = super.call("getPackages", "getPackages():(bytes32[])", []);

    return result[0].toBytesArray();
  }

  try_getProtocols(): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall(
      "getPackages",
      "getPackages():(bytes32[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  getPackageUrl(_protocolName: Bytes, _protocolVersion: Bytes): string {
    let result = super.call("getPackageUrl", "getPackageUrl(bytes32,bytes32):(string)", [
      ethereum.Value.fromFixedBytes(_protocolName),
      ethereum.Value.fromFixedBytes(_protocolVersion)
    ]);

    return result[0].toString();
  }

  try_getProtocolUrl(
    _protocolName: Bytes,
    _protocolVersion: Bytes
  ): ethereum.CallResult<string> {
    let result = super.tryCall("getPackageUrl", "getPackageUrl(bytes32,bytes32):(string)", [
      ethereum.Value.fromFixedBytes(_protocolName),
      ethereum.Value.fromFixedBytes(_protocolVersion)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getPackageVersions(_protocolName: Bytes): Array<Bytes> {
    let result = super.call("getPackageVersions", "getPackageVersions(bytes32):(bytes32[])", [
      ethereum.Value.fromFixedBytes(_protocolName)
    ]);

    return result[0].toBytesArray();
  }

  try_getProtocolVersions(_protocolName: Bytes): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall(
      "getPackageVersions",
      "getPackageVersions(bytes32):(bytes32[])",
      [ethereum.Value.fromFixedBytes(_protocolName)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  nominatedOwner(param0: Bytes): Address {
    let result = super.call(
      "nominatedOwner",
      "nominatedOwner(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(param0)]
    );

    return result[0].toAddress();
  }

  try_nominatedOwner(param0: Bytes): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "nominatedOwner",
      "nominatedOwner(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owners(param0: Bytes): Address {
    let result = super.call("owners", "owners(bytes32):(address)", [
      ethereum.Value.fromFixedBytes(param0)
    ]);

    return result[0].toAddress();
  }

  try_owners(param0: Bytes): ethereum.CallResult<Address> {
    let result = super.tryCall("owners", "owners(bytes32):(address)", [
      ethereum.Value.fromFixedBytes(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  protocols(param0: BigInt): Bytes {
    let result = super.call("protocols", "protocols(uint256):(bytes32)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBytes();
  }

  try_protocols(param0: BigInt): ethereum.CallResult<Bytes> {
    let result = super.tryCall("protocols", "protocols(uint256):(bytes32)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  urls(param0: Bytes, param1: Bytes): string {
    let result = super.call("urls", "urls(bytes32,bytes32):(string)", [
      ethereum.Value.fromFixedBytes(param0),
      ethereum.Value.fromFixedBytes(param1)
    ]);

    return result[0].toString();
  }

  try_urls(param0: Bytes, param1: Bytes): ethereum.CallResult<string> {
    let result = super.tryCall("urls", "urls(bytes32,bytes32):(string)", [
      ethereum.Value.fromFixedBytes(param0),
      ethereum.Value.fromFixedBytes(param1)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class AcceptOwnershipCall extends ethereum.Call {
  get inputs(): AcceptOwnershipCall__Inputs {
    return new AcceptOwnershipCall__Inputs(this);
  }

  get outputs(): AcceptOwnershipCall__Outputs {
    return new AcceptOwnershipCall__Outputs(this);
  }
}

export class AcceptOwnershipCall__Inputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }

  get _name(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class AcceptOwnershipCall__Outputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class NominateNewOwnerCall extends ethereum.Call {
  get inputs(): NominateNewOwnerCall__Inputs {
    return new NominateNewOwnerCall__Inputs(this);
  }

  get outputs(): NominateNewOwnerCall__Outputs {
    return new NominateNewOwnerCall__Outputs(this);
  }
}

export class NominateNewOwnerCall__Inputs {
  _call: NominateNewOwnerCall;

  constructor(call: NominateNewOwnerCall) {
    this._call = call;
  }

  get _name(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _newOwner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class NominateNewOwnerCall__Outputs {
  _call: NominateNewOwnerCall;

  constructor(call: NominateNewOwnerCall) {
    this._call = call;
  }
}

export class PublishCall extends ethereum.Call {
  get inputs(): PublishCall__Inputs {
    return new PublishCall__Inputs(this);
  }

  get outputs(): PublishCall__Outputs {
    return new PublishCall__Outputs(this);
  }
}

export class PublishCall__Inputs {
  _call: PublishCall;

  constructor(call: PublishCall) {
    this._call = call;
  }

  get _name(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _version(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _tags(): Array<Bytes> {
    return this._call.inputValues[2].value.toBytesArray();
  }

  get _url(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class PublishCall__Outputs {
  _call: PublishCall;

  constructor(call: PublishCall) {
    this._call = call;
  }
}
