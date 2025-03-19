from _typeshed import Incomplete
from typing import Final

DEBUG: Final[bool]
NULL_COLUMN: Final[int]
UNSIGNED_CHAR_COLUMN: Final[int]
UNSIGNED_SHORT_COLUMN: Final[int]
UNSIGNED_INT24_COLUMN: Final[int]
UNSIGNED_INT64_COLUMN: Final[int]

def dump_packet(data) -> None: ...

class MysqlPacket:
    def __init__(self, data, encoding) -> None: ...
    def get_all_data(self): ...
    def read(self, size): ...
    def read_all(self): ...
    def advance(self, length: int) -> None: ...
    def rewind(self, position: int = 0) -> None: ...
    def get_bytes(self, position: int, length: int = 1): ...
    def read_uint8(self): ...
    def read_uint16(self): ...
    def read_uint24(self): ...
    def read_uint32(self): ...
    def read_uint64(self): ...
    def read_string(self): ...
    def read_length_encoded_integer(self) -> Incomplete | None: ...
    def read_length_coded_string(self): ...
    def read_struct(self, fmt): ...
    def is_ok_packet(self) -> bool: ...
    def is_eof_packet(self) -> bool: ...
    def is_auth_switch_request(self) -> bool: ...
    def is_extra_auth_data(self) -> bool: ...
    def is_resultset_packet(self) -> bool: ...
    def is_load_local_packet(self) -> bool: ...
    def is_error_packet(self) -> bool: ...
    def check_error(self) -> None: ...
    def raise_for_error(self) -> None: ...
    def dump(self) -> None: ...
