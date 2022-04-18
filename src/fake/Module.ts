function Module(metadata: Record<string, any>) {
  return (target: any) => {
      for (const property in metadata) {
        Reflect.defineMetadata(property, metadata[property], target);
      }
  };
}

export default Module