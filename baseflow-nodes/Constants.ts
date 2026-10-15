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

export const NodeType = {
  Flow: "Flow",
  Start: "Start",
  End: "End",
  Return: "Return",
  Task: "Task",
  Variable: "Variable",
  VariableUpdate: "VariableUpdate",
  Choice: "Choice",
  Branch: "Branch",
  Parallel: "Parallel",
  Thread: "Thread",
  Loop: "Loop",
  Break: "Break",
  Group: "Group",
  Trigger: "Trigger",
} as const;
