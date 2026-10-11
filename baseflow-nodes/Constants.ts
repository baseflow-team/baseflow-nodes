export const DataType = {
  String: "ͼSTRINGͼ",
  Number: "ͼNUMBERͼ",
  Bool: "ͼBOOLͼ",
  Date: "ͼDATEͼ",
  Time: "ͼTIMEͼ",
  DateTime: "ͼDATETIMEͼ",
  Object: "ͼOBJECTͼ",
  Array: "ͼARRAYͼ",
  Map: "ͼMAPͼ",
  File: "ͼFILEͼ",
  Any: "ͼANYͼ",
} as const;

export const ValueSource = {
  Variable: "ͼVARIABLEͼ",
  Template: "ͼTEMPLATEͼ",
  Expression: "ͼEXPRESSIONͼ",
} as const;
