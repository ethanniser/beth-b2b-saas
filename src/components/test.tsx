function Component({ name }: { name: string }) {
  return (
    <p>
      <h1 safe>
        <Foo />
        {name}
      </h1>
    </p>
  );
}

function Foo() {
  return <p>hi</p>;
}
