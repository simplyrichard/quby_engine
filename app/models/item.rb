class Item
  def answerable?; false; end

  def as_json(options = {})
    {
      :class => self.class.to_s
    }
  end
end