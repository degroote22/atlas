import * as React from "react";
import * as Strings from "../Strings";

class AboutPage extends React.Component<{
  Strings: typeof Strings;
}> {
  render() {
    return (
      <section className="hero is-light">
        {this.props.Strings.About.map((s, i) => (
          <div
            key={i}
            className="hero-body"
            style={{ paddingBottom: 0 }}
          >
            <div className="container">
              <h1 className="title">{s.title}</h1>
              <h2 className="subtitle">{s.subtitle}</h2>
            </div>
          </div>
        ))}
      </section>
    );
  }
}

export default AboutPage;
