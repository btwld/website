/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes -- Dart snippets intentionally render source punctuation as JSX text. */
import Link from 'next/link'
import './ack.css'

export function AckHome() {
  return (
    <main className="ack-home not-prose">
      <div className="ack-home-backdrop" aria-hidden="true">
        <div className="ack-home-grid" />
        <div className="ack-home-glow ack-home-glow-one" />
        <div className="ack-home-glow ack-home-glow-two" />
      </div>

      <section className="ack-hero ack-shell" aria-labelledby="ack-hero-title">
        <div className="ack-hero-copy">
          <div className="ack-kicker-row">
            <p className="ack-product-kicker">Dart schemas for every boundary</p>
          </div>

          <h1 id="ack-hero-title">
            Trust the boundary.
            <span>Keep the types.</span>
          </h1>

          <p className="ack-hero-lede">
            Define the boundary once. Validate unknown data, decode it into the models your
            application uses, and encode those models safely for the next boundary.
          </p>

          <div className="ack-hero-actions">
            <Link className="ack-button ack-button-primary" href="/documentation/ack/getting-started/quickstart-tutorial">
              Start validating <span aria-hidden="true">→</span>
            </Link>
            <a className="ack-button ack-button-secondary" href="https://github.com/btwld/ack">
              View on GitHub
            </a>
          </div>

          <ul className="ack-hero-notes" aria-label="Ack highlights">
            <li>Runtime-first validation</li>
            <li>Bidirectional codecs</li>
            <li>Optional code generation</li>
          </ul>
        </div>

        <div className="ack-hero-demo" role="group" aria-label="Ack User codec round trip">
          <div className="ack-window">
            <div className="ack-window-bar">
              <div className="ack-window-context">
                <span>DART</span>
                <code>user_codec.dart</code>
              </div>
              <span className="ack-window-status"><i aria-hidden="true" /> parse() ↔ encode()</span>
            </div>

            <div className="ack-code-stage">
              <div className="ack-code-label" aria-hidden="true">Schema + model codec</div>
              <pre tabIndex={0} aria-label="Dart User model codec with parse and encode"><code>
                <span className="tok-keyword">final</span> userCodec = <span className="tok-type">Ack</span>.<span className="tok-call">object</span>({'{'}{`\n`}
                {'  '}<span className="tok-string">'name'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">string</span>().<span className="tok-call">minLength</span>(<span className="tok-number">2</span>),{`\n`}
                {'  '}<span className="tok-string">'email'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">string</span>().<span className="tok-call">email</span>(),{`\n`}
                {'  '}<span className="tok-string">'createdAt'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">datetime</span>(),{`\n`}
                {'}'}).<span className="tok-call">codec</span>&lt;<span className="tok-type">User</span>&gt;({`\n`}
                {'  '}decode: <span className="tok-call">User.fromMap</span>,{`\n`}
                {'  '}encode: (user) =&gt; user.<span className="tok-call">toMap</span>(),{`\n`}
                );{`\n\n`}
                <span className="tok-comment">// User</span>{`\n`}
                <span className="tok-keyword">final</span> user = userCodec.<span className="tok-call">parse</span>(wireData);{`\n`}
                <span className="tok-comment">// JSON-safe</span>{`\n`}
                <span className="tok-keyword">final</span> json = userCodec.<span className="tok-call">encode</span>(user);
              </code></pre>
            </div>
          </div>
        </div>
      </section>

      <section className="ack-workflow ack-shell" aria-labelledby="ack-workflow-title">
        <header className="ack-section-heading">
          <span className="ack-eyebrow">ONE SCHEMA, BOTH DIRECTIONS</span>
          <h2 id="ack-workflow-title">From boundary data to <code>User</code>—and back.</h2>
          <p>
            Validation and transformation stay in one readable contract. Nested codecs handle
            field values while the outer codec constructs the model your application understands.
          </p>
        </header>

        <div className="ack-workflow-list">
          <article className="ack-workflow-step">
            <div className="ack-workflow-copy">
              <span className="ack-feature-index">01 / DEFINE</span>
              <h3>Describe the boundary and the model.</h3>
              <p>
                Compose field schemas for the wire shape, then map the validated result into
                <code> User</code>. Built-in codecs such as <code>Ack.datetime()</code> keep rich
                values inside your application.
              </p>
              <Link href="/documentation/ack/essentials/schemas">Explore schemas <span aria-hidden="true">→</span></Link>
            </div>
            <div className="ack-code-sample">
              <span className="ack-sample-label">Boundary fields + model mapping</span>
              <pre tabIndex={0} aria-label="Define User boundary fields and model mapping"><code><span className="tok-keyword">final</span> boundary = <span className="tok-type">Ack</span>.<span className="tok-call">object</span>({'{'}{`\n`}  <span className="tok-string">'createdAt'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">datetime</span>(),{`\n`}{'}'});{`\n\n`}<span className="tok-keyword">final</span> userCodec = boundary.<span className="tok-call">codec</span>&lt;<span className="tok-type">User</span>&gt;({`\n`}  decode: <span className="tok-call">User.fromMap</span>,{`\n`}  encode: (user) =&gt; user.<span className="tok-call">toMap</span>(),{`\n`});</code></pre>
            </div>
          </article>

          <article className="ack-workflow-step">
            <div className="ack-workflow-copy">
              <span className="ack-feature-index">02 / VALIDATE + DECODE</span>
              <h3>Parse boundary data into a <code>User</code>.</h3>
              <p>
                <code>userCodec.parse()</code> checks every field, decodes the ISO timestamp, and
                calls <code>User.fromMap</code>. Use <code>safeParse()</code> when you want structured
                failures instead of an exception.
              </p>
              <div className="ack-workflow-links">
                <Link href="/documentation/ack/advanced/codecs">Understand codecs <span aria-hidden="true">→</span></Link>
                <Link href="/documentation/ack/essentials/error-handling">Handle parse failures <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="ack-code-sample">
              <span className="ack-sample-label">Boundary map → validated User</span>
              <pre tabIndex={0} aria-label="Parse boundary data into User"><code><span className="tok-keyword">final</span> user = userCodec.<span className="tok-call">parse</span>(wireData);{`\n`}print(user.createdAt); <span className="tok-comment">// UTC DateTime</span></code></pre>
            </div>
          </article>

          <article className="ack-workflow-step">
            <div className="ack-workflow-copy">
              <span className="ack-feature-index">03 / ENCODE</span>
              <h3>Send the model back safely.</h3>
              <p>
                <code>userCodec.encode(user)</code> runs the outer model mapping and every nested
                field codec in reverse. The resulting map is ready for JSON serialization.
              </p>
              <Link href="/documentation/ack/essentials/json-serialization">Serialize with codecs <span aria-hidden="true">→</span></Link>
            </div>
            <div className="ack-code-sample">
              <span className="ack-sample-label">User model → JSON-safe map</span>
              <pre tabIndex={0} aria-label="Encode User into JSON-safe boundary data"><code><span className="tok-keyword">final</span> json = userCodec.<span className="tok-call">encode</span>(user);{`\n`}print(json['createdAt']); <span className="tok-comment">// ISO String</span></code></pre>
            </div>
          </article>
        </div>
      </section>

      <section className="ack-extensions ack-shell" aria-labelledby="ack-extensions-title">
        <header className="ack-section-heading ack-section-heading-wide">
          <div>
            <span className="ack-eyebrow">ONE SCHEMA, MORE REACH</span>
            <h2 id="ack-extensions-title">Go beyond validation without duplicating the contract.</h2>
          </div>
          <p>
            Use the schema you already trust for structured AI, provider-specific output,
            generated types, and reversible conversions at every application boundary.
          </p>
        </header>

        <div className="ack-extension-grid">
          <article className="ack-feature-card ack-feature-ai">
            <div className="ack-feature-copy">
              <span className="ack-feature-index">Firebase AI / Gemini</span>
              <h3>Guide generation. Then verify it.</h3>
              <p>
                The shipped Firebase AI adapter turns your Ack schema into
                <code> responseJsonSchema</code>. After generation, the same schema remains the
                authoritative runtime validator and codec boundary.
              </p>
              <Link href="/documentation/ack/advanced/json-schema-integration">Explore structured output <span aria-hidden="true">→</span></Link>
            </div>
            <div className="ack-mini-code ack-ai-code">
              <span className="ack-sample-label">structured_output.dart · guide → verify</span>
              <pre tabIndex={0} aria-label="Guide and validate Firebase AI structured output"><code><span className="tok-keyword">final</span> responseSchema = <span className="tok-type">Ack</span>.<span className="tok-call">object</span>({'{'}{`\n`}  <span className="tok-string">'answer'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">string</span>(),{`\n`}  <span className="tok-string">'sources'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">list</span>(<span className="tok-type">Ack</span>.<span className="tok-call">uri</span>()),{`\n`}  <span className="tok-string">'generatedAt'</span>: <span className="tok-type">Ack</span>.<span className="tok-call">datetime</span>(),{`\n`}{'}'});{`\n\n`}<span className="tok-keyword">final</span> config = <span className="tok-type">GenerationConfig</span>({`\n`}  responseJsonSchema:{`\n`}    responseSchema.<span className="tok-call">toFirebaseAiResponseJsonSchema</span>(),{`\n`});{`\n\n`}<span className="tok-keyword">final</span> output = responseSchema.<span className="tok-call">parse</span>({`\n`}  jsonDecode(response.text!),{`\n`});</code></pre>
            </div>
          </article>

          <article className="ack-feature-card ack-feature-adapters">
            <div className="ack-feature-copy">
              <span className="ack-feature-index">PROVIDER ADAPTERS</span>
              <h3>One model. Provider-specific output.</h3>
              <p>
                <code>AckSchemaModel</code> is the target-independent adapter boundary. Use the
                built-in <code>toJsonSchema()</code> path, the Firebase AI adapter, or author a
                focused adapter for OpenAI and other provider SDKs.
              </p>
              <Link href="/documentation/ack/advanced/schema-converter-quickstart">Build a provider adapter <span aria-hidden="true">→</span></Link>
            </div>
            <dl className="ack-provider-list" aria-label="Ack provider adapter paths">
              <div><dt>Canonical model</dt><dd><code>AckSchemaModel</code></dd></div>
              <div><dt>Ships with</dt><dd>Firebase AI · JSON Schema</dd></div>
              <div className="is-extensible"><dt>Extend</dt><dd>Your provider adapter</dd></div>
            </dl>
          </article>

          <article className="ack-feature-card ack-feature-types">
            <div className="ack-feature-copy">
              <span className="ack-feature-index">TWO-WAY MODEL GENERATION</span>
              <h3>Own the schema—or the class.</h3>
              <p>Use <code>@AckInfer()</code> to generate an immutable model from a schema, or <code>@AckModel()</code> to derive a validated schema and JSON helpers from your class.</p>
              <Link href="/documentation/ack/advanced/typesafe-schemas">Generate models and schemas <span aria-hidden="true">→</span></Link>
            </div>
            <div className="ack-mini-code">
              <span className="ack-sample-label">user_schema.dart · optional generator</span>
              <pre tabIndex={0} aria-label="Generate a model from a schema or a schema from a model"><code><span className="tok-annotation">@AckInfer</span>(){`\n`}<span className="tok-keyword">final</span> userSchema ={`\n`}  <span className="tok-type">Ack</span>.<span className="tok-call">object</span>(...);{`\n`}<span className="tok-comment">// → User</span>{`\n\n`}<span className="tok-annotation">@AckModel</span>(){`\n`}<span className="tok-keyword">final class</span> Account{`\n`}    <span className="tok-keyword">with</span> _$AccountAck {'{'} ... {'}'}{`\n`}<span className="tok-comment">// → AccountSchema</span></code></pre>
            </div>
          </article>

          <article className="ack-feature-card ack-feature-codecs">
            <div className="ack-feature-copy">
              <span className="ack-feature-index">BUILT-IN + CUSTOM CODECS</span>
              <h3>Compose rich values through objects and lists.</h3>
              <p>Built-in field codecs decode common boundary formats inside <code>Ack.object()</code> and <code>Ack.list()</code>. Add <code>Ack.codec(...)</code> for your own runtime type; each layer reverses together on encode.</p>
              <Link href="/documentation/ack/advanced/codecs">Meet codecs <span aria-hidden="true">→</span></Link>
            </div>
            <dl className="ack-codec-catalogue" aria-label="Ack built-in and custom codec catalogue">
              <div><dt><code>Ack.date()</code></dt><dd>String ↔ DateTime</dd></div>
              <div><dt><code>Ack.datetime()</code></dt><dd>ISO String ↔ UTC DateTime</dd></div>
              <div><dt><code>Ack.uri()</code></dt><dd>String ↔ Uri</dd></div>
              <div><dt><code>Ack.duration()</code></dt><dd>milliseconds int ↔ Duration</dd></div>
              <div><dt><code>Ack.enumCodec(values)</code></dt><dd>name String ↔ enum value</dd></div>
              <div className="is-custom"><dt><code>Ack.codec(...)</code></dt><dd>Boundary value ↔ your type</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="ack-cta-wrap ack-shell" aria-labelledby="ack-cta-title">
        <div className="ack-cta">
          <div>
            <span className="ack-eyebrow">START WITH ONE BOUNDARY</span>
            <h2 id="ack-cta-title">Make unknown data explicit.</h2>
            <p>Add Ack, describe the shape you expect, and keep the rest of your Dart code focused on trusted values.</p>
          </div>
          <div className="ack-cta-actions">
            <div className="ack-install" aria-label="Install Ack with Dart">
              <span aria-hidden="true">$</span>
              <code>dart pub add ack</code>
            </div>
            <Link className="ack-button ack-button-primary" href="/documentation/ack/getting-started/installation">
              Read installation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
