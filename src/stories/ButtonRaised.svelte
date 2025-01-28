<script>
  /**
   * @typedef {Object} Props
   * @property {boolean} [primary] Is this the principal call to action on the page?
   * @property {string} [backgroundColor] What background color to use
   * @property {'small' | 'medium' | 'large'} [size] How large should the button be?
   * @property {string} label Button contents
   * @property {() => void} [onClick] The onclick event handler
   */

  /** @type {Props} */
  const { primary = false, backgroundColor, size = 'medium', onClick, children } = $props();
</script>

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`].join(' ')}
  class:storybook-button--primary={primary}
  class:storybook-button--secondary={!primary}
  style:background-color={backgroundColor}
  onclick={onClick}
>
  {@render children()}
</button>

<style lang="scss">
button {
    font-family: inherit;
    background-color: #fff;
    aspect-ratio: 1/1;
}
.storybook-button {
  display: inline-block;
  cursor: pointer;
  border: 0;
  border-radius: 3em;
  font-weight: 700;
  line-height: 1;
}
.storybook-button--primary {
  background-color: #1ea7fd;
  color: white;
}
.storybook-button--secondary {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
  color: #333;
}
.storybook-button--small {
  padding: 10px;
  font-size: 12px;
}
.storybook-button--medium {
  padding: 12px;
  font-size: 14px;
}
.storybook-button--large {
  padding: 12px;
  font-size: 16px;
}

</style>